# Technical Debt List

## Overview

This document identifies existing technical debt in the GeoExplore project that affects maintainability, scalability, and performance.

---

## 1. Monolithic API URL Builder (High Priority)

The `buildEndpointUrl` function uses a large switch-case structure to handle multiple endpoint types.

**Issues:**

* Hard to extend when adding new endpoints
* Repetitive query string construction (`fields=...`)
* Violates single responsibility principle

**Impact:**

* Reduced maintainability
* Higher risk of bugs when modifying logic

---

## 2. Duplicate and Inefficient String Operations in Filtering

Filtering logic performs repeated `.toLowerCase()` and redundant `.includes()` checks.

**Issues:**

* Duplicate computations
* Inconsistent normalization

**Impact:**

* Slight performance overhead
* Reduced readability

---

## 3. Tight Coupling of Filtering Logic

Filtering logic is implemented as one large function instead of smaller reusable predicates.

**Issues:**

* Hard to reuse filtering logic independently
* Difficult to test individual conditions

**Impact:**

* Reduced modularity
* Harder debugging

---

## 4. Limited Sorting Functionality

Sorting is limited only to population with separate conditional branches.

**Issues:**

* Not reusable for other fields (e.g., area)
* Not scalable for future features

**Impact:**

* Code duplication if more sorting is added
* Reduced flexibility

---

## 5. No Caching Strategy for API Requests

All API requests are made directly to the REST Countries API without caching.

**Issues:**

* Repeated network requests for the same data
* Increased dependency on external API availability

**Impact:**

* Slower load times
* Potential downtime issues

---

## Selected Debt for Refactoring

**Chosen Item:** Monolithic API URL Builder

**Reason for Selection:**

* High impact on both maintainability and extensibility
* Affects multiple features across the application
* Clear opportunity to simplify using a configuration-based approach

---

## Refactoring Summary

The `buildEndpointUrl` function was refactored into a configuration-driven mapping system:

* Replaced switch-case with a lookup map
* Centralized query construction
* Reduced duplication of `fields` parameters
* Improved scalability for adding new endpoints

---

## Result

* Cleaner and more maintainable code
* Reduced complexity
* Easier future extension of API endpoints
