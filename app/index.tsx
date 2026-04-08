import { Redirect } from 'expo-router';

export default function Index() {
  // Redirect to login screen as the default entry point
  // Replace this with your auth state check logic
  return <Redirect href="/(auth)/login" />;
}
