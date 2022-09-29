# Conflictor
[![Maintainability](https://api.codeclimate.com/v1/badges/3390baf2c0eb32d61d4d/maintainability)](https://codeclimate.com/github/shpingalet007/conflictor/maintainability) [![Test Coverage](https://api.codeclimate.com/v1/badges/3390baf2c0eb32d61d4d/test_coverage)](https://codeclimate.com/github/shpingalet007/conflictor/test_coverage)

<img src="https://github.com/shpingalet007/conflictor/blob/main/readme/how-to-use.png" width="800" />

Conflict analyse tool for projects that has complicated release schemas.

## What it can?
- Looks what branches are conflicting
- Can determine where conflict happens
- Does cross-branch analysis
- Gives recommendations about conflict resolution

## What it can't?
- Well, it can't resolve conflicts between you and your friends . Only git branches currently, sorry.

## Cons/Pros
```diff
+ Can be used as cli utility
+ Can be used in Github Actions
+ Can be imported in other modules
+ Github repositories are supported
- Gitlab repositories are not supported yet
- Bitbucket repositories are not supported yet
- Sourceforge repositories are not supported yet
- Any other git platforms are not supported yet
```

## Milestone
- [x] Make graph image output (still not stable thing, don't rely without think before)
- [ ] Make GUI for this module (I'll think about make something, but if you can do it, you are welcome to import and make a repo)
- [ ] Provide support for other git platforms (not in priority, however PR's are welcomed 😺)
