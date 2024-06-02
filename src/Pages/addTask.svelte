<script>
  import { db } from '../backend/firebase';
  import { collection, addDoc } from 'firebase/firestore';
  import { userIsAuth } from '../backend/isAuth';

  let taskName = '';
  let taskNote = '';
  let dueDate = '';
  let formVisible = false;
  let successMessage = '';

  async function addTask() {
    const { uid } = $userIsAuth; 
    if (uid && taskName.trim() !== '') { 
      try {
        await addDoc(collection(db, 'tasks'), { //saving the form informations in the database based on the uid of the user
          name: taskName.trim(),
          note: taskNote.trim(),
          dueDate: dueDate.trim(),
          createdAt: new Date(),
          uid: uid
        });

        //clear all the input fields
        taskName = '';
        taskNote = '';
        dueDate = '';
        formVisible = false;
        successMessage = 'Task added successfully!';
        setTimeout(() => {
          successMessage = '';
        }, 2000);
      } catch (error) {
        console.error('Error adding task: ', error);
      }
    }
  }

  function isBeforeToday(date) {  //used to avoid users from entering old dates
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return date < today;
  }

  function handleClick(event) {
    if (!formVisible) return;
    const isClickedInsideForm = document.querySelector('.addTask-box').contains(event.target);
    const isClickedOnButton = event.target.tagName === 'BUTTON';
    if (!isClickedInsideForm && !isClickedOnButton) {
      formVisible = false;
    }

    if (formVisible && dueDate && isBeforeToday(new Date(dueDate))) {
      alert("Due date cannot be in the past. Please select a future date.");
    }
  }

  document.addEventListener('click', handleClick);
</script>

<main style="{formVisible ? 'padding-bottom: 100vh;' : ''}">
  {#if formVisible}
    <form on:submit|preventDefault={addTask}>
      <div class="addTask-wrapper">
        <div class="addTask-box">
          <h2>What do you have to do?</h2>
          <input type="text" bind:value={taskName} placeholder="Task Name..." required>
          <input type="text" bind:value={taskNote} placeholder="Task Note...">
          <input type="date" bind:value={dueDate} placeholder="Due Date..." required min="{new Date().toISOString().split('T')[0]}">
          <button type="submit">Add Task</button>
        </div>
      </div>
    </form>
  {:else}
    <button on:click={() => formVisible = true}>Add New Task</button>
  {/if}
  
  {#if successMessage}
    <div class="success-message">{successMessage}</div>
  {/if}
</main>

<div class="overlay" style="{formVisible ? 'display: block;' : 'display: none;'}"></div>

<style>
  .overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 999;
  }

  .addTask-wrapper {
    margin-bottom: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
   
  }
  h2{
    color: #021024;
  }

  .addTask-box {
    height: 400px;
    width: 100%;
    max-width: 400px;
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 20px;
    background-color: #f9f9f9;
    display: flex;
    flex-direction: column;
    position: relative;
    z-index: 1000;
     background-color: #C1E8FF;
  }

  .addTask-box input {
    height: 50px;
    margin-bottom: 10px;
    border-radius: 5px;
    border: 1px solid blue;
    padding: 10px;
    font-size: 16px;
  }

  .addTask-box input:hover {
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }

  .addTask-box button {
    margin-bottom: 10px;
    padding: 10px;
    font-size: 16px;
    cursor: pointer;
    background-color: #5483B3;
    border: none;
    border-radius: 5px;
    color: white;
  }

  .addTask-box button:hover {
    transition: 0.2s;
    background-color: #052659;
    color: aliceblue;
  }

  .success-message {
    margin-top: 20px;
    color: green;
    font-weight: bold;
  }

  @media (max-width: 768px) {
    .addTask-box {
      width: 100%;
      max-width: none;
      height: auto;
    }

    .addTask-box input {
      font-size: 14px;
      height: 40px;
    }

    .addTask-box button {
      font-size: 14px;
      height: 40px;
    }
  }
</style>
