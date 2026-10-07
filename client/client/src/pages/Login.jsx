import AuthForm from './AuthForm'

export default function Login({ navigate }) {
  return <AuthForm register={false} navigate={navigate} />
}
