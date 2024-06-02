<script>
  import { auth } from '../backend/firebase';
  import { signInWithEmailAndPassword } from 'firebase/auth';
  import { navigate } from 'svelte-routing';
  
  let email = '';
  let password = '';
  let error = '';
  
  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('User logged in:', userCredential.user);
      
      sessionStorage.setItem('uid', userCredential.user.uid);
      
      navigate('/todo');
    } catch (err) {
      error = err.message;
    }
  };
  
  const handleSignupClick = () => {
    navigate('/signup');
  };
</script>

  
  <main>
    <div class="login-wrapper">
      <form class="login-inputs" on:submit={handleLogin}>
        <h2>Login</h2>
        {#if error}
          <p class="error">{error}</p>
        {/if}
        <div class="login-items">
          <label for="email">Email:</label>
          <input type="email" id="email" name="email" bind:value={email} required />
        </div>
        <div class="login-items">
          <label for="password">Password</label>
          <input type="password" id="password" name="password" bind:value={password} required />
        </div>
        <button class="login-btn" type="submit">Login</button>
      </form>
      <div> 
        <p>Dont have an account? <button on:click={handleSignupClick}>Sign Up</button> </p>
      </div>
    </div>
  </main>

  
  <style>
    .login-wrapper {
      background-color: #f5f5f5;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      width: 100%;
      max-width: 400px;
      margin: 0 auto;
    }
  
    .login-inputs {
      display: flex;
      flex-direction: column;
    }
  
    .login-inputs h2 {
      margin-bottom: 1.5rem;
      color: #333;
      font-size: 1.5rem;
      text-align: center;
    }
  
    .login-items {
      margin-bottom: 1.5rem;
    }
  
    .login-items label {
      margin-bottom: 0.5rem;
      color: #666;
      font-size: 1rem;
    }
  
    .login-items input {
      width: 100%; 
      padding: 1rem;
      border: 1px solid #ccc;
      border-radius: 6px;
      font-size: 1rem;
      color: #333;
      background-color: #fff;
      transition: background-color 0.3s;
      box-sizing: border-box;
    }
  
    .login-items input:focus {
      background-color: #f0f0f0;
    }
  
    .login-btn {
      padding: 1rem;
      border: none;
      border-radius: 6px;
      background-color: #4C5B6C;
      color: white;
      font-size: 1rem;
      cursor: pointer;
      transition: background-color 0.3s;
      width: 100%;
    }
  
    .login-btn:hover {
      background-color: #344955;
    }
  
    .error {
      color: #ff0033;
      margin-bottom: 1rem;
      font-size: 0.9rem;
      text-align: center;
    }
  
    @media (max-width: 768px) {
      .login-wrapper {
        padding: 1.5rem;
      }
  
      .login-inputs h2 {
        font-size: 1.25rem;
      }
  
      .login-items input {
        width: calc(100% - 2rem);
        margin-left: 1rem;
      }
    }
  </style>
  