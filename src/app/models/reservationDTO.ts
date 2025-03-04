import {UserDTO} from "./userDTO";
import {CarDTO} from "./carDTO";

export interface ReservationDTO {
  id: number;
  startDate: Date;
  endDate: Date;
  status: string;
  userDTO?: UserDTO;
  carDTO: CarDTO;
}
