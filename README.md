# Garincha-Group

## Usage

### Запуск в Docker

```bash
# 1. Соберите образ
docker build -t garincha-group .

# 2. Запустите контейнер (порт 8000 на хосте → 8000 в контейнере)
docker run -d --name garincha-group -p 8000:8000 garincha-group
```
