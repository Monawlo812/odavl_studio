Encoding Fix Applied:

FILES CHANGED:
1. examples/golden-repo/src/example.ts - RECREATED as UTF-8
   - Removed corrupted binary file
   - Created clean TypeScript example with proper UTF-8 encoding
   - Contains simple greet function and version export

2. .gitattributes - CREATED
   - Sets text=auto eol=lf for all files
   - Explicit LF line endings for source files
   - Prevents future encoding issues

3. .editorconfig - VERIFIED (already exists)
   - charset = utf-8 already configured
   - Consistent formatting standards in place

BEFORE/AFTER:
- BEFORE: File detected as binary, caused "Invalid character" TS errors
- AFTER: Clean UTF-8 text file, should compile successfully

LINES CHANGED: ~12 lines total (well within 40 line limit)

This should resolve all golden repo build issues.