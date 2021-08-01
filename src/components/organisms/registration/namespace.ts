namespace Registration {
  export type RegistrationData = Record<string, string | boolean>;

  export interface Props {
    onSubmit: (registrationData: RegistrationData) => void
  }
}

export default Registration;