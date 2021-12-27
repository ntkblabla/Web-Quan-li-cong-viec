## Getting Started By Docker

- First, build docker image:

```bash
docker-compose buid
```

- Secondary, install packages:

```bash
docker-compose run backend yarn
```

- Next, migrate database:

```bash
docker-compose run backend yarn migrate:run
```

- After that, run the development server by:

```bash
docker-compose up
```

Open [http://localhost:8010](http://localhost:8010) with your browser to see the result.
# Web-Quan-li-cong-viec
