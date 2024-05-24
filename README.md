# Timestamped File Creator API

This is a simple Node.js API built with Express that allows users to create timestamped text files and list all files in a specified folder.

## Features

- Create a text file with the current timestamp.
- List all files in the specified folder.

## Prerequisites

- Node.js installed on your machine.

## Installation

1. Clone the repository:

2. Install dependencies:

3. Start the server:

The server will start listening on port 8100 by default.

## Usage

### Create a Timestamped File

To create a timestamped file, make a GET request to `/create-file` endpoint:

This will create a text file with the current timestamp in the system's temporary directory.

### List All Files

To list all files in the specified folder, make a GET request to `/list-all-files` endpoint:

This will return a JSON object containing an array of all files in the folder.

## License

This project is licensed under the [MIT License](LICENSE).
