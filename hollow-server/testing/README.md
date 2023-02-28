# How to Test the Server

This section is for stress testing (load balance testing) the server under various scenarios.

For testing we are using k6.

## Installing k6

For mac it is easy,

```bast
brew install k6
```

For other platforms like linux or windows, please follow the official [documentation](https://k6.io/docs/get-started/installation/).

## Running the test

```bash
k6 run test.js
```
