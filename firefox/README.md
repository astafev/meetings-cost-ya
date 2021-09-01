## Manifest

### permissions

We need the following permissions:
```
        "storage",
        "webRequest",
        "webRequestBlocking",
        "https://calendar.yandex-team.ru/*"
```

* `storage` to keep settings
* *the rest* for intercepting web queries (maybe something from that list is not necessary, copied from examples)

