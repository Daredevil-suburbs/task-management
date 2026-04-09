package com.example.taskmanagement.service;

import com.example.taskmanagement.dto.TaskDTO;
import com.example.taskmanagement.model.*;
import com.example.taskmanagement.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TaskServiceTest {

    @Mock
    private TaskRepository taskRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private TagRepository tagRepository;

    @Mock
    private LevelService levelService;

    @Mock
    private AchievementService achievementService;

    @Mock
    private UserService userService;

    @InjectMocks
    private TaskService taskService;

    private User testUser;
    private Task testTask;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setEmail("test@example.com");
        testUser.setName("Test User");
        testUser.setTotalXp(0);
        testUser.setLevel(1);
        testUser.setHunterRank(HunterRank.E);

        testTask = new Task();
        testTask.setId(1L);
        testTask.setTitle("Test Task");
        testTask.setDescription("Test Description");
        testTask.setStatus(Task.Status.TODO);
        testTask.setPriority(Task.Priority.MEDIUM);
        testTask.setXpReward(100);
        testTask.setDueDate(LocalDate.now().plusDays(7));
        testTask.setUser(testUser);
    }

    @Test
    void testCreateTask() {
        // Arrange
        TaskDTO.Request request = new TaskDTO.Request();
        request.setTitle("New Task");
        request.setDescription("New Description");
        request.setPriority(Task.Priority.HIGH);
        request.setXpReward(150);

        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));
        when(taskRepository.save(any(Task.class))).thenReturn(testTask);

        // Act
        TaskDTO.Response response = taskService.createTask(request, "test@example.com");

        // Assert
        assertNotNull(response);
        assertEquals("New Task", response.getTitle());
        verify(taskRepository, times(1)).save(any(Task.class));
    }

    @Test
    void testGetAllTasks() {
        // Arrange
        List<Task> tasks = List.of(testTask);
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));
        when(taskRepository.findByUserId(1L)).thenReturn(tasks);

        // Act
        List<TaskDTO.Response> responses = taskService.getAllTasks("test@example.com", null, null);

        // Assert
        assertNotNull(responses);
        assertEquals(1, responses.size());
        assertEquals("Test Task", responses.get(0).getTitle());
    }

    @Test
    void testGetTasksByStatus() {
        // Arrange
        List<Task> tasks = List.of(testTask);
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));
        when(taskRepository.findByUserIdAndStatus(1L, Task.Status.TODO)).thenReturn(tasks);

        // Act
        List<TaskDTO.Response> responses = taskService.getAllTasks("test@example.com", Task.Status.TODO, null);

        // Assert
        assertNotNull(responses);
        assertEquals(1, responses.size());
    }

    @Test
    void testCompleteTask() {
        // Arrange
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));
        when(taskRepository.findByIdAndUserId(1L, 1L)).thenReturn(Optional.of(testTask));
        when(taskRepository.save(any(Task.class))).thenReturn(testTask);
        when(achievementService.checkAndAward(any(User.class))).thenReturn(new ArrayList<>());

        doAnswer(invocation -> {
            User user = invocation.getArgument(0);
            user.setTotalXp(150);
            return null;
        }).when(levelService).awardXp(any(User.class), anyInt(), any(Task.Priority.class));

        // Act
        TaskDTO.CompleteResponse response = taskService.completeTask(1L, "test@example.com");

        // Assert
        assertNotNull(response);
        assertEquals(Task.Status.DONE, response.getTask().getStatus());
        assertTrue(response.getXpEarned() > 0);
        verify(taskRepository, times(1)).save(any(Task.class));
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void testCompleteAlreadyCompletedTask() {
        // Arrange
        testTask.setStatus(Task.Status.DONE);
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));
        when(taskRepository.findByIdAndUserId(1L, 1L)).thenReturn(Optional.of(testTask));

        // Act & Assert
        assertThrows(RuntimeException.class, () ->
            taskService.completeTask(1L, "test@example.com")
        );
    }

    @Test
    void testDeleteTask() {
        // Arrange
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));
        when(taskRepository.findByIdAndUserId(1L, 1L)).thenReturn(Optional.of(testTask));

        // Act
        taskService.deleteTask(1L, "test@example.com");

        // Assert
        verify(taskRepository, times(1)).delete(any(Task.class));
    }

    @Test
    void testSearchTasks() {
        // Arrange
        List<Task> tasks = List.of(testTask);
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));
        when(taskRepository.searchByUserId(1L, "Test")).thenReturn(tasks);

        // Act
        List<TaskDTO.Response> responses = taskService.searchTasks("test@example.com", "Test");

        // Assert
        assertNotNull(responses);
        assertEquals(1, responses.size());
    }

    @Test
    void testGetTasksWithSorting() {
        // Arrange
        Task task1 = new Task();
        task1.setId(1L);
        task1.setTitle("Task 1");
        task1.setXpReward(100);
        task1.setDueDate(LocalDate.now().plusDays(5));
        task1.setUser(testUser);

        Task task2 = new Task();
        task2.setId(2L);
        task2.setTitle("Task 2");
        task2.setXpReward(200);
        task2.setDueDate(LocalDate.now().plusDays(10));
        task2.setUser(testUser);

        List<Task> tasks = List.of(task2, task1); // Unsorted
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));
        when(taskRepository.findByUserId(1L)).thenReturn(tasks);

        // Act - Sort by XP ascending
        List<TaskDTO.Response> responses = taskService.getTasksWithSortAndPage(
            "test@example.com", "xpReward", "asc", null, null
        );

        // Assert
        assertNotNull(responses);
        assertEquals(2, responses.size());
        assertEquals(100, responses.get(0).getXpReward()); // Lower XP first
        assertEquals(200, responses.get(1).getXpReward()); // Higher XP second
    }

    @Test
    void testGetTasksWithPagination() {
        // Arrange
        List<Task> tasks = new ArrayList<>();
        for (int i = 1; i <= 25; i++) {
            Task task = new Task();
            task.setId((long) i);
            task.setTitle("Task " + i);
            task.setUser(testUser);
            tasks.add(task);
        }

        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));
        when(taskRepository.findByUserId(1L)).thenReturn(tasks);

        // Act - Get page 2 with size 10
        List<TaskDTO.Response> responses = taskService.getTasksWithSortAndPage(
            "test@example.com", null, null, 2, 10
        );

        // Assert
        assertNotNull(responses);
        assertEquals(10, responses.size());
        assertEquals("Task 11", responses.get(0).getTitle());
        assertEquals("Task 20", responses.get(9).getTitle());
    }
}
