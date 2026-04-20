# Security Risk Register

## Overview

This document identifies key security risks in the GeoExplore application and the corresponding mitigation strategies.

---

## Risk 1: Client-Side Authentication Bypass

**Description:**
Authentication is implemented using localStorage, which can be modified by users.

**Impact:**

* Unauthorized users could gain access by manually setting tokens

**Mitigation:**

* Validate session expiry on every protected action
* Automatically clear invalid/expired sessions
* Clearly document limitation (non-production security)

---

## Risk 2: Invalid or Malicious User Input

**Description:**
Users may enter malformed or unexpected input into search and filter fields.

**Impact:**

* Unexpected behavior
* Potential API misuse

**Mitigation:**

* Endpoint-specific validation rules
* Input normalization and sanitization
* Character restrictions and length limits
* Disabled actions when input is invalid

---

## Risk 3: External API Dependency Failure

**Description:**
Application relies on REST Countries API, which may become unavailable.

**Impact:**

* Application features may break or fail to load data

**Mitigation:**

* Input validation to reduce unnecessary requests
* Graceful error handling in UI
* (Future improvement) caching or fallback data strategy

---

## Summary

The identified risks are mitigated through validation, session control, and defensive UI behavior. Remaining risks are documented and acknowledged.
