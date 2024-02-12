## Getting started

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/dacadeorg/icp-message-board-contract)

If you rather want to use GitHub Codespaces, click this button instead:

[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/dacadeorg/icp-message-board-contract?quickstart=1)

**NOTE**: After `dfx deploy`, when developing in GitHub Codespaces, run `./canister_urls.py` and click the links that are shown there.

[![Open locally in Dev Containers](https://img.shields.io/static/v1?label=Dev%20Containers&message=Open&color=blue&logo=visualstudiocode)](https://vscode.dev/redirect?url=vscode://ms-vscode-remote.remote-containers/cloneInVolume?url=https://github.com/dacadeorg/icp-message-board-contract)

## Prerequisities

1. Install `nvm`:
- `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash`

2. Switch to node v18:
- `nvm use 18`
- `npm i esbuild-wasm` - for Apple Silicon only

3. Install build dependencies:
## For Ubuntu and WSL2
```
sudo apt update
sudo apt install clang
sudo apt install build-essential
sudo apt install libssl-dev
sudo apt install pkg-config
```
## For macOS:
```
xcode-select --install
brew install llvm
echo 'export PATH="/opt/homebrew/opt/llvm/bin:$PATH"' >> ~/.zshrc
```

4. Install `dfx`
- `DFX_VERSION=0.16.1 sh -ci "$(curl -fsSL https://sdk.dfinity.org/install.sh)"`

5. Add `dfx` to PATH:
- `echo 'export PATH="$PATH:$HOME/bin"' >> "$HOME/.bashrc"`

6. Create a project structure:
- create `src` dir
- create `index.ts` in the `src` dir
- create `tsconfig.json` in the root directory with the next content
```
{
    "compilerOptions": {
        "allowSyntheticDefaultImports": true,
        "strictPropertyInitialization": false,
        "strict": true,
        "target": "ES2020",
        "moduleResolution": "node",
        "allowJs": true,
        "outDir": "HACK_BECAUSE_OF_ALLOW_JS"
    }
}
```
- create `dfx.json` with the next content
```
{
  "canisters": {
    "message_board": {
      "type": "custom",
      "main": "src/index.ts",
      "candid": "src/index.did",
      "build": "npx azle message_board",
      "wasm": ".azle/message_board/message_board.wasm",
      "gzip": true
    }
  }
}
```
where `message_board` is the name of the canister. 

6. Create a `package.json` with the next content and run `npm i`:
```
{
  "name": "message_board",
  "version": "0.1.0",
  "description": "Internet Computer message board application",
  "dependencies": {
    "@dfinity/agent": "^0.21.4",
    "@dfinity/candid": "^0.21.4",
    "azle": "^0.20.1",
    "body-parser": "^1.20.2",
    "express": "^4.18.2",
    "uuid": "^9.0.1"
  },
  "engines": {
    "node": "^12 || ^14 || ^16 || ^18 || ^20"
  },
  "devDependencies": {
    "@types/body-parser": "^1.19.5",
    "@types/express": "^4.17.21"
  }
}
```

7. Run a local replica
- `dfx start --host 127.0.0.1:8000`

#### IMPORTANT NOTE 
If you make any changes to the `StableBTreeMap` structure like change datatypes for keys or values, changing size of the key or value, you need to restart `dfx` with the `--clean` flag. `StableBTreeMap` is immutable and any changes to it's configuration after it's been initialized are not supported.
- `dfx start --host 127.0.0.1:8000 --clean`

8. Deploy a canister
- `dfx deploy`

9. Stop a local replica
- `dfx stop`

## Interaction with the canister

When a canister is deployed, `dfx deploy` produces a link to the Candid interface in the shell output.

Candid interface provides a simple UI where you can interact with functions in the canister.

On the other hand, you can interact with the canister using `dfx` via CLI:

### get canister id:
- `dfx canister id <CANISTER_NAME>`
Example:
- `dfx canister id message_board`
Response:
```
bkyz2-fmaaa-aaaaa-qaaaq-cai
```

Now, the URL of your canister should like this:
```
http://bkyz2-fmaaa-aaaaa-qaaaq-cai.localhost:8000
```

With this URL, you can interact with the canister using an HTTP client of your choice. We are going to use `curl`.

### create a message:
- `curl -X POST <CANISTER_URL>/<REQUEST_PATH> -H "Content-type: application/json" -d <PAYLOAD>`
Example: 
- `curl -X POST http://bkyz2-fmaaa-aaaaa-qaaaq-cai.localhost:8000/messages -H "Content-type: application/json" -d '{"title": "todo list", "body": "some important things", "attachmentURL": "url/path/to/some/photo/attachment"}'`
Response:
```
{
    "id": "d8326ec8-fe70-402e-8914-ca83f0f1055b",
    "createdAt": "2024-02-09T11:24:32.441Z",
    "title": "todo list",
    "body": "some important things",
    "attachmentURL": "url/path/to/some/photo/attachment"
}
```

### update a message:
- `curl -X PUT <CANISTER_URL>/<REQUEST_PATH>/<MESSAGE_ID> -H "Content-type: application/json" -d <PAYLOAD>`
Example (In this case we include a message id in the payload to identify the message we want to update): 
- `curl -X PUT  http://bkyz2-fmaaa-aaaaa-qaaaq-cai.localhost:8000/messages/d8326ec8-fe70-402e-8914-ca83f0f1055b -H "Content-type: application/json" -d '{"title": "UPDATED TITLE", "body": "some important things", "attachmentURL": "url/path/to/some/photo/attachment"}'`
Response:
```
{
    "id": "d8326ec8-fe70-402e-8914-ca83f0f1055b",
    "createdAt": "2024-02-09T11:24:32.441Z",
    "title": "UPDATED TITLE",
    "body": "some important things",
    "attachmentURL": "url/path/to/some/photo/attachment",
    "updatedAt": "2024-02-09T11:26:59.002Z"
}
```

### get all messages:
- `curl <CANISTER_URL>/<REQUEST_PATH>`
Example:
- `curl http://bkyz2-fmaaa-aaaaa-qaaaq-cai.localhost:8000/messages`
Response:
```
[
    {
        "id": "d8326ec8-fe70-402e-8914-ca83f0f1055b",
        "createdAt": "2024-02-09T11:24:32.441Z",
        "title": "UPDATED TITLE",
        "body": "some important things",
        "attachmentURL": "url/path/to/some/photo/attachment",
        "updatedAt": "2024-02-09T11:26:59.002Z"
    }
]
```

### get a message:
- `curl <CANISTER_URL>/<REQUEST_PATH>/<MESSAGE_ID>`
Example (here we only provide a message id):
- `curl http://bkyz2-fmaaa-aaaaa-qaaaq-cai.localhost:8000/messages/d8326ec8-fe70-402e-8914-ca83f0f1055b`
Response:
```
{
    "id": "d8326ec8-fe70-402e-8914-ca83f0f1055b",
    "createdAt": "2024-02-09T11:24:32.441Z",
    "title": "UPDATED TITLE",
    "body": "some important things",
    "attachmentURL": "url/path/to/some/photo/attachment",
    "updatedAt": "2024-02-09T11:26:59.002Z"
}
```

### delete a message:
- `curl -X DELETE <CANISTER_URL>/<REQUEST_PATH>/<MESSAGE_ID>`
Example (here we only provide a message id):
- `curl -X DELETE http://bkyz2-fmaaa-aaaaa-qaaaq-cai.localhost:8000/messages/d8326ec8-fe70-402e-8914-ca83f0f1055b`
Response (returns the deleted message):
```
{
    "id": "d8326ec8-fe70-402e-8914-ca83f0f1055b",
    "createdAt": "2024-02-09T11:24:32.441Z",
    "title": "UPDATED TITLE",
    "body": "some important things",
    "attachmentURL": "url/path/to/some/photo/attachment",
    "updatedAt": "2024-02-09T11:26:59.002Z"
}
```
