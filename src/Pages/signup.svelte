<script>
    import { createUserWithEmailAndPassword } from 'firebase/auth';
    import { auth } from '../backend/firebase';
    import { navigate } from 'svelte-routing';
  
    let name = '';
    let email = '';
    let password = '';
    let error = '';
  
    const handleSignUp = async (event) => {
      event.preventDefault();
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        console.log('User signed up:', userCredential.user);
        navigate('/todo');
      } catch (err) {
        if (err.code === 'auth/email-already-in-use') { //check if user enters an existing email then it displays a message with sign in button
            error = 'Email already in use';
        } else {
            error = err.message;
        }
      }
    };

    const handleSignInClick = () => {
        navigate('/');
    };
  </script>
  
  <main>
    <div class="signup-wrapper">
      <form class="signup-form" on:submit={handleSignUp}>
        <h2>Sign Up</h2>
        
        <div class="signup-field">
          <label for="name">Name:</label>
          <input type="text" id="name" name="name" bind:value={name} required />
        </div>
        <div class="signup-field">
          <label for="email">Email:</label>
          <input type="email" id="email" name="email" bind:value={email} required />
          {#if error}
        <p class="error">{error}</p>
        {#if error === 'Email already in use'}
            <button class="signin-btn" on:click={handleSignInClick}>Sign In Instead??</button>
        {/if}
    {/if}
        </div>
        <div class="signup-field">
          <label for="password">Password:</label>
          <input type="password" id="password" name="password" bind:value={password} required />
        </div>
        <button class="signup-btn" type="submit">Sign Up</button>
      </form>
    </div>
  </main>
  
  <style>
    .signup-wrapper {
      background-color: #f5f5f5;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      width: 100%;
      max-width: 400px;
      margin: 0 auto;
    }
  
    .signup-form {
      display: flex;
      flex-direction: column;
    }
  
    .signup-form h2 {
      margin-bottom: 1.5rem;
      color: #333;
      font-size: 1.5rem;
      text-align: center;
    }
  
    .signup-field {
      margin-bottom: 1.5rem;
    }
  
    .signup-field label {
      margin-bottom: 0.5rem;
      color: #666;
      font-size: 1rem;
    }
  
    .signup-field input {
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
  
    .signup-field input:focus {
      background-color: #f0f0f0;
    }
  
    .signup-btn{
      padding: 1rem;
        border: none;
        border-radius: 6px;
        background-color: #4C5B6C;
        color: white;
        font-size: 1rem;
        cursor: pointer;
        transition: background-color 0.3s;
        width: 100%;
        margin-top: 1rem;
    }
.signin-btn {
        padding: 0.5rem;
        border: none;
        border-radius: 6px;
        background-color: #4C5B6C;
        color: white;
        font-size: 1rem;
        cursor: pointer;
        transition: background-color 0.3s;
        width: 50%;
        margin-top: 0.1rem;
    }

    .signup-btn:hover, .signin-btn:hover {
        background-color: #344955;
    }
  
    .error {
      color: #ff0033;
      margin-bottom: 1rem;
      font-size: 0.9rem;
      text-align: center;
    }

  
  </style>
  