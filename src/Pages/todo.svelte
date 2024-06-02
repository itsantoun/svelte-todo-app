<!-- combines both the addTask.svelte and displayTask.svelte to form a general its like the main Dahsboard -->
<script>
  import AddTask from "./addTask.svelte";
  import DisplayTasks from "./displayTasks.svelte";
  import { auth, signOut } from '../backend/firebase';
  import { navigate } from 'svelte-routing';

  const logout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };
</script>

<main class="todo-container">
  <div class="top-container">
    <AddTask />
    <button on:click={logout}>Logout</button>
  </div>
  <DisplayTasks />
</main>

<style>
  .todo-container {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .top-container {
    display: flex;
    flex-direction: row;
    align-items: center; 
    width: 100%;
    justify-content: space-between;
    margin-bottom: 20px;
  }

  .add-task-container {
    display: flex;
    flex-direction: row;
    align-items: center; 
  }

  button {
    margin-left: 10px; 
    padding: 10px 20px;
    font-size: 16px;
    cursor: pointer;
    background-color: brown;
    border: none;
    border-radius: 5px;
    color: white;
  }

  button:hover {
    transition: 0.2s;
    background-color: rgb(122, 5, 5);
    color: aliceblue;
  }

  @media (max-width: 768px) {
    .todo-container {
      flex-direction: column;
    }

    .top-container {
      flex-direction: column;
      align-items: stretch;
      margin-bottom: 20px;
    }

    button {
      width: 100%;
      margin-top: 10px; 
      margin-left: 0; 
    }
  }
</style>
