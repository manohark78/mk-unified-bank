package com.banking.security;

import com.banking.entity.Role;
import com.banking.entity.User;
import com.banking.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

  private final UserRepository userRepository;

  @Override
  public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
    var userOpt = userRepository.findByEmail(username);
    if (userOpt.isEmpty()) userOpt = userRepository.findByPhoneNumber(username);
    var user = userOpt.orElseThrow(() -> new UsernameNotFoundException("User not found"));

    List<SimpleGrantedAuthority> auth = user.getRoles().stream()
            .map(Role::getName)
            .map(SimpleGrantedAuthority::new)
            .toList();

    return new org.springframework.security.core.userdetails.User(
            user.getEmail(),                          // principal username
            user.getPassword(),
            user.isEnabled(),                         // enabled
            true, true, true,
            auth
    );
  }
}
