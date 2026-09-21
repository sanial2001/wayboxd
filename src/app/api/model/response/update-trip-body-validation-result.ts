export interface UpdateTripValidatedBody {
  title?: string;
  blurb?: string | null;
  outboundUrl?: string;
}

export interface UpdateTripBodyValidationSuccess {
  error: null;
  body: UpdateTripValidatedBody;
}

export interface UpdateTripBodyValidationFailure {
  error: string;
  body: null;
}

export type UpdateTripBodyValidationResult =
  UpdateTripBodyValidationSuccess | UpdateTripBodyValidationFailure;
