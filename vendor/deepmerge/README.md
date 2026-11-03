# Local deepmerge security fix

This package is the CommonJS build of `deepmerge` 4.3.1 with the `__proto__`
key filter proposed in upstream pull request
[TehShrike/deepmerge#286](https://github.com/TehShrike/deepmerge/pull/286), commit
`9add7d91abb595703679faf7b7942bbe7f87642b`.

It is vendored because the registry has no patched `deepmerge` release even
though GHSA-gcqx-w48m-w2h4 currently marks 4.3.1 as affected. Remove this copy
after an upstream patched release is available and validated.
