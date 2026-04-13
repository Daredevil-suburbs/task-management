/** 
 * @author Daredevil-suburbs
 */
package com.example.taskmanagement.service;

import com.example.taskmanagement.dto.LeaderboardDTO;
import com.example.taskmanagement.model.User;
import com.example.taskmanagement.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Service
public class LeaderboardService {

    @Autowired
    private UserRepository userRepository;

    public List<LeaderboardDTO.Entry> getLeaderboard(int limit) {
        List<User> topUsers = userRepository.findTop10ByOrderByTotalXpDesc();

        // Limit results and assign ranks
        return IntStream.range(0, Math.min(limit, topUsers.size()))
            .mapToObj(i -> LeaderboardDTO.Entry.fromUser(topUsers.get(i), i + 1))
            .collect(Collectors.toList());
    }

    public int getUserRank(Long userId) {
        List<User> allUsers = userRepository.findAll(
            org.springframework.data.domain.Sort.by(
                org.springframework.data.domain.Sort.Direction.DESC, "totalXp"
            )
        );

        for (int i = 0; i < allUsers.size(); i++) {
            if (allUsers.get(i).getId().equals(userId)) {
                return i + 1;
            }
        }

        return -1; // User not found
    }
}
