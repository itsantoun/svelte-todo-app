<script>
  import { Router, Route, navigate } from 'svelte-routing';
  import { userIsAuth } from './backend/isAuth'
  import LoginPage from './Pages/login.svelte';
  import SignupPage from './Pages/signup.svelte';
  import TodoPage from './Pages/todo.svelte';

  let currentUser;

  // Subscribe to the user store to get the current user
  $: userIsAuth.subscribe(value => {
    currentUser = value;
    if (currentUser && (window.location.pathname === '/' || window.location.pathname === '/signup')) {
      navigate('todo');
    }
    if (!currentUser && window.location.pathname === '/todo') {
      navigate('/');
    }
  });
</script>

<main>
  <Router>
    <!-- Redirect to the todo page if the user is logged in and tries to access login or signup pages -->
    <Route path="/" component={currentUser ? TodoPage : LoginPage} />
    <Route path="signup" component={currentUser ? TodoPage : SignupPage} />
    <Route path="todo" component={currentUser ? TodoPage : LoginPage} />
  </Router>
</main>
