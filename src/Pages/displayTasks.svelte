<script>
  import { db } from '../backend/firebase';
  import { collection, query, where, getDocs, deleteDoc, doc, updateDoc, onSnapshot } from 'firebase/firestore';
  import { onMount, onDestroy } from 'svelte';
  import { userIsAuth } from '../backend/isAuth';
  // @ts-ignore
  import FaTrash from 'svelte-icons/fa/FaTrash.svelte';
  // @ts-ignore
  import FaCheckCircle from 'svelte-icons/fa/FaCheckCircle.svelte';

  let tasks = [];
  let filteredTasks = [];
  let filterType = 'all';
  let unsubscribe;

  onMount(async () => {
    const user = $userIsAuth; //get the user who logged in
    if (user) {
      const q = query(collection(db, 'tasks'), where('uid', '==', user.uid)); //fetch the tasks of the user based on their uid
      try {
        const querySnapshot = await getDocs(q);
        tasks = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        filterTasks();

        // Listen for changes
        unsubscribe = onSnapshot(q, (snapshot) => {
          tasks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          filterTasks();
        });
      } catch (error) {
        console.error('Error fetching tasks: ', error);
      }
    }
  });

  onDestroy(() => {
    // Unsubscribe from the snapshot listener when the component is destroyed
    unsubscribe();
  });

  function filterTasks() { //tasks are being filtered into 3 parts, 1 pending when user enters the task, 2- marked as completed, and 3rd all the tasked entered from the user with their status
    if (filterType === 'all') {
      filteredTasks = tasks;
    } else if (filterType === 'pending') {
      filteredTasks = tasks.filter(task => !task.completed);
    } else if (filterType === 'completed') {
      filteredTasks = tasks.filter(task => task.completed);
    }
  }

  //Funtion used to color the due date, if the difference between the due date and today's date is 1 then the task is due very soon 
  //and then it is colored in red. if between 2 and 9 days then its due soon, and colored in orange and > 10 than its far.
  function getDifferenceInDays(date1, date2) {
    const diffInTime = date1.getTime() - date2.getTime();
    return Math.ceil(diffInTime / (1000 * 3600 * 24));
  }

  function isDueDateClose(taskDueDate) {
    const today = new Date();
    const dueDate = new Date(taskDueDate);
    const differenceInDays = getDifferenceInDays(dueDate, today);
    
    if (differenceInDays === 1) {
      return 'red';
    } else if (differenceInDays >= 2 && differenceInDays <= 9) {
      return 'orange';
    } else {
      return 'blue';
    }
  }

  async function deleteTask(taskId) {  //handle the delete task from the list and database as well
    const confirmation = window.confirm('Do you really want to delete this task?');
    if (confirmation) {
      try {
        await deleteDoc(doc(db, 'tasks', taskId));
        tasks = tasks.filter(task => task.id !== taskId);
        filterTasks();
      } catch (error) {
        console.error('Error deleting task: ', error);
      }
    }
  }

  async function markAsComplete(taskId) {
    try {
      const taskDoc = doc(db, 'tasks', taskId);
      await updateDoc(taskDoc, { completed: true });
      tasks = tasks.map(task => task.id === taskId ? { ...task, completed: true } : task);
      filterTasks();
    } catch (error) {
      console.error('Error marking task as complete: ', error);
    }
  }

  function setFilter(type) {
    filterType = type;
    filterTasks();
  }
</script>

<main>
  <h1>Task List</h1>
  <div class="filter-buttons">
    <button on:click={() => setFilter('all')}>All Tasks</button>
    <button on:click={() => setFilter('pending')}>Pending Tasks</button>
    <button on:click={() => setFilter('completed')}>Completed Tasks</button>
  </div>
  
  {#if filteredTasks.length > 0}
    <div class="tasks-wrapper">
      {#each filteredTasks as task (task.id)}
        <div class="task-box">
          <label for="Task"><strong>Task: </strong>
          <h3 style="width: 160px;">{task.name}</h3></label>

          <label for="notes"><strong>Notes: </strong>
            <p style="width: 160px;">{task.note}</p></label>

          <label for="dueDate" style="color: {isDueDateClose(task.dueDate)};"><strong>Due-Date: </strong>
          <p>{task.dueDate}</p></label>

          {#if task.completed}
          <label for="Status"><strong>Status: </strong>
              <p class="completed">Completed!</p></label>

              <label for="Status"><strong>Action: </strong>
                <div class="button-container">
                  <button class="delete-icon" on:click={() => deleteTask(task.id)}>
                    <FaTrash />
                  </button>
                </div>
              </label>
          {:else}
          <label for="Status"><strong>Status: </strong>
              <p class="pending">Pending...</p></label>

              <label for="Status"><strong>Action: </strong>
            <div class="button-container">
              <button class="delete-icon" on:click={() => deleteTask(task.id)}>
                <FaTrash />
              </button>

              <button class="complete-icon" on:click={() => markAsComplete(task.id)}>
                <FaCheckCircle />
              </button>
            </div>
          </label>
          {/if}
        </div>
      {/each}
    </div>
  {:else}
    <p><strong>No tasks found?</strong> <br> Press on the Add new task to add your first task!</p>
  {/if}
</main>

<style>
  main {
    font-family: Arial, sans-serif;
    padding: 20px;
  }

  h1 {
    color: #021024;
  }

  .filter-buttons {
    margin-bottom: 20px;
    display: flex;
    gap: 10px;
  }

  .filter-buttons button {
    padding: 10px 20px;
    font-size: 16px;
    cursor: pointer;
    background-color: #052659;
    color: white;
    border: none;
    border-radius: 5px;
  }

  .filter-buttons button:hover {
    background-color: #7DA0CA;
  }

  .completed {
    color: green;
    font-weight: bold;
  }

  .pending {
    color: orange;
    font-weight: bold;
    animation: blink 2s infinite;
  }

  @keyframes blink {
    0% { opacity: 1; }
    50% { opacity: 0; }
    100% { opacity: 1; }
  }

  .tasks-wrapper {
    display: flex;
    flex-direction: column;
    gap: 20px;
    max-width: 100%;
  }

  .task-box {
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 10px;
    background-color: #f9f9f9;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    flex-wrap: wrap;
  }

  .task-box:hover {
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
    transition: 0.2s;
  }

  .task-details {
    flex: 1;
    min-width: 150px;
  }

  .task-box label {
    margin-bottom: 5px;
    display: block;
  }

  .task-box p {
    margin: 5px;
    margin-top: 20px;
  }

  /* Style for buttons */
  .button-container {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .task-box button {
    border: none;
    background: none;
    cursor: pointer;
    padding: 0;
    height: 20px;
  }

  .delete-icon:hover {
    color: red; 
  }

  .complete-icon:hover {
    color: green; 
  }

  @media (max-width: 768px) {
    .task-box {
      flex-direction: column;
      width: 40%;
      align-items: center;
    }
    .task-details {
      width: 100%;
    }
  }
</style>
