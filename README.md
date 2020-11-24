# BBC BFS Scrapper

Steps to run

- Create `db.json` file in the project root
- Add this inside `db.json`

```json
{
  "purifierErrorLinks": [],
  "noCategory": [],
  "articles": []
}
```

- Run These commands

```bash
yarn install
yarn run json-server
```

- In new terminal window run this command

```bash
yarn run dev
```

You can use `npm` if you prefer `npm` just replace `yarn` with `npm`
