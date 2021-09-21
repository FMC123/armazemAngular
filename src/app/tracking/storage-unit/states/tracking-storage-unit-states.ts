import { TrackingStorageUnitStateSearchedOrdered } from './tracking-storage-unit-state-searched-ordered';
import { TrackingStorageUnitStateSelectedSearched } from './tracking-storage-unit-state-selected-searched';
import { TrackingStorageUnitStateSelectedOrdered } from './tracking-storage-unit-state-selected-ordered';
import { TrackingStorageUnitStateSearched } from './tracking-storage-unit-state-searched';
import { TrackingStorageUnitStateOrdered } from './tracking-storage-unit-state-ordered';
import { TrackingStorageUnitState } from './tracking-storage-unit-state';
import { TrackingStorageUnitStateBlank } from './tracking-storage-unit-state-blank';

export class TrackingStorageUnitStates {

  static blank = new TrackingStorageUnitStateBlank();
  static ordered = new TrackingStorageUnitStateOrdered();
  static searched = new TrackingStorageUnitStateSearched();
  static selectedOrdered = new TrackingStorageUnitStateSelectedOrdered();
  static selectedSearched = new TrackingStorageUnitStateSelectedSearched();
  static searchedOrdered = new TrackingStorageUnitStateSearchedOrdered();

}
