import {ReservationDTO} from "./reservationDTO";
import {UserProfileDTO} from "./userProfileDTO";

export interface UserDTO {
  id: number;
  username: string;
  password: string;
  email: string;
  userProfiles: UserProfileDTO[];
  reservations: ReservationDTO[];
}
