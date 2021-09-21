import { CookieService } from 'ngx-cookie';
import { Endpoints } from './../endpoints';
import { Injectable, EventEmitter } from '@angular/core';
import { Http, Headers, URLSearchParams } from '@angular/http';

import {AccessToken} from './access-token';
import {Warehouse} from './../warehouse/warehouse';
import {User} from './../user/user';
import {Logger} from '../shared/logger/logger';
import {Parameter} from '../parameter/parameter';
import {WarehouseStakeholder} from "../warehouse-stakeholder/warehouse-stakeholder";

@Injectable()
export class AuthService {
	authChange = new EventEmitter<void>();
	warehouseChange = new EventEmitter<void>();
	accessToken: AccessToken = null;
	menus: Array<string> = [];
	warehouses: Array<Warehouse> = [];
	parameters: Array<Parameter> = [];
	version = '';

	constructor(
		private http: Http,
		private logger: Logger,
		private cookieService: CookieService
	) {
		this.logger.setUser(null);
		this.authChange.subscribe(() => {
			this.logger.setUser(this.accessToken ? this.accessToken.user : null);
		});
	}

	get authenticated(): boolean {
		return !!this.accessToken && !!this.accessToken.id;
	}

	get isAdmin(): boolean {
		return (this.authenticated && this.accessToken.admin);
	}

  get isLeader(): boolean {
    return (this.authenticated && this.accessToken.leader);
  }

	get hasWarehouse() {
		return !!this.accessToken && !!this.accessToken.warehouse;
	}

	findParameterValue(key: string) {
		if (!this.parameters) {
			return null;
		}

		const parameter = this.parameters.find(p => p.keys === key);

		if (!parameter) {
			return null;
		}

		return parameter.value;
	}

	findParameterBoolean(key: string) {
		if (!this.parameters) {
			return null;
		}

		const parameter = this.parameters.find(p => p.keys === key);

		if (!parameter) {
			return false;
		}

		return parameter.value === 'S';
	}

	loginByToken() {
		let token = this.cookieService.get('token');
		if (token) {
			return this.loginWithToken(token);
		} else {
			return Promise.reject('Token inexistente');
		}
	}

	login(login: string, password: string) {
		let headers = new Headers();
		headers.append(
			'Content-Type',
			'application/x-www-form-urlencoded; charset=utf-8'
		);
		let data = `login=${login}&password=${password}`;
		return this.http
			.post(Endpoints.loginUrl, data, { headers: headers })
			.toPromise()
			.then(response => {
				let token = response.json().id;
				return this.loginWithToken(token);
			});
	}

	logoff() {
		this.http
			.delete(Endpoints.loggedUserURL, {
				headers: this.appendOrCreateAuthHeader()
			})
			.toPromise()
			.then(() => {});
		this.accessToken = null;
		this.cookieService.remove('token');
		(<any>this.http)._defaultOptions.headers.delete('Authorization');
		this.authChange.emit();
	}

	warehouseLogin(warehouseId: string) {
		let headers = new Headers({ 'Content-Type': 'application/json' });
		// PUT
		return this.http
			.put(
				Endpoints.loggedUserURL,
				{
					warehouseId: warehouseId
				},
				{ headers: this.appendOrCreateAuthHeader(headers) }
			)
			.toPromise()
			.then(response => {
				this.accessToken = AccessToken.fromData(response.json());
				this.warehouseChange.emit();
				return Promise.all([
					this.fillMenuIfHasWarehouse(),
					this.fillParametersIfHasWarehouse()
				]);
			});
	}

	changePassword(oldPassword: string, newPassword: string): Promise<any> {
		let headers = new Headers({ 'Content-Type': 'application/json' });
		return this.http
			.put(
				Endpoints.userPasswordURL,
				{
					oldPassword: oldPassword,
					newPassword: newPassword
				},
				{ headers: this.appendOrCreateAuthHeader(headers) }
			)
			.toPromise();
	}

	hasPermission(menu: string) {
		let hasPermission = this.menus.some(m => m.startsWith(menu));
		return hasPermission;
	}

	appendOrCreateAuthHeader(headers?: Headers) {
		if (!headers) {
			headers = new Headers();
		}
		if (this.authenticated) {
			headers.delete('Authorization');
			headers.append('Authorization', 'Bearer ' + this.accessToken.id);
		}
		return headers;
	}

	forgetRememberedCredentials() {
		this.cookieService.remove('login');
		this.cookieService.remove('name');
	}

	get rememberedCredentials() {
		let login = this.cookieService.get('login');
		let name = this.cookieService.get('name');
		if (!!login) {
			return {
				login: login,
				name: name
			};
		}
		return null;
	}

	findAndSetRememberedLogin(login: string) {
		let params = new URLSearchParams();
		params.append('login', login);
		return this.http
			.get(Endpoints.loginUrl, {
				search: params
			})
			.toPromise()
			.then(response => {
				let user = User.fromData(response.json());
				this.cookieService.put('login', user.login);
				this.cookieService.put('name', user.name);
			});
	}

  listWarehouses(): Promise<Array<Warehouse>> {
    return this.http
      .get(Endpoints.userWarehousesURL)
      .toPromise()
      .then(response => {
        return Warehouse.fromListData(response.json());
      });
  }

  listWarehousesAutocomplete(search?: string): Promise<Array<Warehouse>> {
    let params = new URLSearchParams();
    params.append('search', search ? search : '');
    params.append('limit', '10');

    return this.http.get(
      Endpoints.userWarehousesURL,
      {search: params},
    )
      .toPromise()
      .then(response => {
        return Warehouse.fromListData(response.json());
      });
  }

	loadVersion() {
		return this.http
			.get(Endpoints.aboutUrl)
			.toPromise()
			.then(response => {
				const json = response.json();
				return json.version;
			});
	}

	listParameters(): Promise<Array<Parameter>> {
		return this.http
			.get(Endpoints.parametersUrl)
			.toPromise()
			.then(response => {
				return Parameter.fromListData(response.json());
			});
	}

	private loginWithToken(token) {
		(<any>this.http)._defaultOptions.headers.delete('Authorization');
		(<any>this.http)._defaultOptions.headers.append(
			'Authorization',
			'Bearer ' + token
		);

		this.loadVersion().then(version => {
      this.version = version;
		});

		return this.findCurrentAccessToken()
			.then(accessToken => {
				this.accessToken = accessToken;
				return this.fillMenuIfHasWarehouse().then(() => {
					return this.fillParametersIfHasWarehouse().then(() => {
						return this.fillWarehouses().then(() => {
							this.authChange.emit();
							this.cookieService.put('token', token);
							this.cookieService.put('name', accessToken.user.name);
							this.cookieService.put('login', accessToken.user.login);
							return this.accessToken;
						});
					});
				});
			})
			.catch(error => {
				this.logoff();
				return Promise.reject(error);
			});
	}

	public fillParametersIfHasWarehouse(): Promise<void> {
		if (!this.hasWarehouse) {
			return Promise.resolve();
		}

		return this.listParameters().then(parameters => {
			this.parameters = parameters;
		});
	}

	private fillMenuIfHasWarehouse(): Promise<void> {
		if (!this.hasWarehouse) {
			return Promise.resolve();
		}

		return this.listMenus().then(menus => {
			this.menus = menus;
		});
	}

	private fillWarehouses(): Promise<void> {
		return this.listWarehouses().then(warehouses => {
			this.warehouses = warehouses;
		});
	}

	private listMenus(): Promise<Array<string>> {
		return this.http
			.get(Endpoints.userMenusURL)
			.toPromise()
			.then(response => {
				return response.json();
			});
	}

	private findCurrentAccessToken(): Promise<AccessToken> {
		return this.http
			.get(Endpoints.loggedUserURL)
			.toPromise()
			.then(response => {
				return AccessToken.fromData(response.json());
			});
	}
}
