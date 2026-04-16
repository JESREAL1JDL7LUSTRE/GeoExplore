# QA Plan - GeoExplore

## Test Levels

### Unit Testing
Unit testing verifies isolated logic such as endpoint generation, numeric formatting, capital extraction, and filtering behavior.

### Integration Testing
Integration testing verifies how multiple parts work together, such as API response handling and the rendering of filtered country lists.

### System Testing
System testing verifies the complete user flow, including data fetch, country selection, detail display, filtering, sorting, and theme switching.

## Entry Criteria
Testing may begin when:
- the project builds successfully
- the testing framework is installed
- utility functions are extracted and testable
- at least one working feature exists

## Exit Criteria
Testing may end when:
- at least 5 unit tests have been executed
- all critical and major defects are resolved or documented
- no blocking defects remain open
- test evidence is captured

## Severity Levels

### S1 - Critical
System crash, complete application failure, or loss of a major core feature.

### S2 - Major
An important feature fails or behaves incorrectly with no reasonable workaround.

### S3 - Minor
A non-blocking defect affects expected behavior but has a workaround.

### S4 - Low
A cosmetic or very small issue that does not significantly affect system use.

## Planned Test Types
- Unit tests
- Integration tests
- System tests

## Tools
- Vitest for unit testing
- Manual browser testing for integration and system testing

## Test Deliverables
- QA Plan
- Unit test files
- Test execution evidence
- Defect log
- Bug fix evidence