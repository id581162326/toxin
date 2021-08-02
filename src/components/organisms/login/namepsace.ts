namespace Login {
  export interface Props {
    onSubmit: (loginData: Record<string, string>) => void
  }
}

export default Login;