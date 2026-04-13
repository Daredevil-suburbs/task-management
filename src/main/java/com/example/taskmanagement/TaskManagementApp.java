/** 
 * @author Daredevil-suburbs
 */
package com.example.taskmanagement;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class TaskManagementApp {
    public static void main(String[] args) {
        SpringApplication.run(TaskManagementApp.class, args);
    }
}
