# Project Name

The project description

## Roadmap

View the project roadmap [here](LINK_TO_DOC)

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.

# Table of Contents

1. [Usage](#Usage)
1. [Requirements](#requirements)
1. [Development](#development)
    1. [Installing Dependencies](#installing-dependencies)
    1. [Tasks](#tasks)

## Usage

The Pricing microservice requires a running Redis server to be listening on port 6379. On OSX, redis can be installed using homebrew with the command "brew install redis". Once installed, a server can be started with the command redis-server.

To set up PostreSQL Database:

1. Install postgres using the following commands, with homebrew installed: brew update brew install postgresql
2. To start a postgresql server, run the following command in its own terminal tab. 
postgres -D /usr/local/var/postgres
3. To run the schema file and generate the database, run the following command from the Venmoo root directory: psql -f ./database/schema.sql postgres
4. To open the postgres shell and directly manipulate the database, enter the following from the command line: psql postgres

## Requirements

- Node 6.9.x
- Redis 3.2.x
- Postgresql 9.6.x
- etc

## Other Information

(TODO: fill this out with details about your project. Suggested ideas: architecture diagram, schema, and any other details from your app plan that sound interesting.)

