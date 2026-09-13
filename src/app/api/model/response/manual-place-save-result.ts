import { PlaceModel } from '@/app/api/model/response/place-model';

export interface ManualPlaceSaveCreated {
  status: 'created';
  place: PlaceModel;
}

export interface ManualPlaceSaveDuplicate {
  status: 'duplicate';
  candidates: PlaceModel[];
}

export type ManualPlaceSaveResult = ManualPlaceSaveCreated | ManualPlaceSaveDuplicate;
