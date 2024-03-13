export interface AuthUserDto {
  sub: string;
  phoneNumber: string;
  fullName: string;
  validUntil: string;
  userType: number;
  iat: number;
  exp: number;
}
