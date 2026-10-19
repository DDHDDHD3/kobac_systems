# Changelog

User-facing changes are recorded here. Release titles describe scope; package versions use semantic versioning.

## [Unreleased]

## [v1.2] — 2026-10-19 · frontend design

### Added

- Original Kobi companion: expressive motion, pointer tracking, dragging, keyboard movement, roaming, fetch play, and a minimal chat connected to the existing AI handler.
- Seven-project showcase with repository assets, real demo destinations, source links, and category filters.
- Shared reduced-motion controls, responsive layouts, local Manrope fonts, and source/license notices.
- Animated README preview, contribution guidance, release notes, and verification documentation.

### Changed

- Public composition, typography, brand tokens, navigation, content sections, controls, and footer.
- Hero with an extruded three-leaf symbol derived from the KOBAC mark.
- Scroll storytelling: captured-layout project assembly, full-width work scenes, image depth, kinetic headings, process chapters, and footer letter assembly.
- Public components separated from existing Operations Portal state and integration code.

### Fixed

- Narrow-screen chat/pet placement, short desktop project-caption spacing, touch controls, and mobile navigation interaction.
- Chat configuration failures presented as a readable unavailable-service message.

### Scope & verification

- Frontend and repository documentation only. Server code, schema, API contracts, authentication, deployment configuration, secrets, and dependency versions are unchanged.
- TypeScript, production build, whitespace checks, and desktop/tablet/mobile browser review passed locally. Successful AI replies and authenticated transactions were not verified locally because no database was configured.
- Details and remaining limits: [v1.2 release notes](docs/releases/v1.2.md).

[Unreleased]: https://github.com/DDHDDHD3/kobac_systems/compare/v1.2...HEAD
[v1.2]: https://github.com/DDHDDHD3/kobac_systems/releases/tag/v1.2
