# craftdoor-ui

This nodejs project is the webapp frontend for [craftdoor](https://github.com/pakohan/craftdoor). It communicates with craftdoor via a REST API.

## Installation

1. Install `node` and `npm`. The latest version available in `apt-get` may be too old. Instead, follow instructions [here](https://github.com/nodesource/distributions/blob/master/README.md#debinstall),
  ```
  $ curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash -
  $ sudo apt-get install -y nodejs
  ```
1. Install project dependencies,
  ```
  $ npm install
  ```
1. Serve development version of the HTML locally,
  ```
  $ npm run serve
  ```

## Deploying

1. Compile and minify code for production,
  ```
  $ npm run build
  ```
1. Copy the built code to `craftdoor`'s `/assets/static`.
  ```
  $ mv dist ${CRAFTDOOR}/assets/static
  ```
1. Follow instructions to launch `craftdoor` backend.

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
