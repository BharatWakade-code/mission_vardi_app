import 'package:firebase_auth/firebase_auth.dart';
import 'package:google_sign_in/google_sign_in.dart';
class AuthService {
  final FirebaseAuth _auth = FirebaseAuth.instance;
  final GoogleSignIn _googleSignIn = GoogleSignIn(
    serverClientId: '274263956432-7p3f92feo84e8j3ggneafqk0j3amd26g.apps.googleusercontent.com',
  );
  Future<User?> signInWithGoogle() async {
    try {
      // 1. Trigger the native Google Sign-In flow
      final GoogleSignInAccount? googleUser = await _googleSignIn.signIn();
      
      if (googleUser == null) return null; // User canceled
      // 2. Fetch the auth details (tokens)
      final GoogleSignInAuthentication googleAuth = await googleUser.authentication;
      // 3. Create a new credential for Firebase
      final OAuthCredential credential = GoogleAuthProvider.credential(
        accessToken: googleAuth.accessToken,
        idToken: googleAuth.idToken,
      );
      // 4. Sign in to Firebase with the credential
      final UserCredential userCredential = await _auth.signInWithCredential(credential);
      
      return userCredential.user;
    } catch (e) {
      print("Error signing in: $e");
      return null;
    }
  }
  Future<void> signOut() async {
    await _googleSignIn.signOut();
    await _auth.signOut();
  }
}