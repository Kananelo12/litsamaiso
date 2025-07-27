type FormType = "sign-in" | "sign-up";

interface SignUpParams {
  uid: string;
  name: string;
  email: string;
  studentId: string;
  password: string;
  studentCard: File;
}

interface SignInParams {
  studentId: string;
  idToken: string;
}

// interface User {

// }
