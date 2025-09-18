@echo off
echo Building Number Guessing Game...

:: Create output directory
if not exist "dist" mkdir dist

:: Compile Java files
javac -d dist *.java

:: Create JAR file
cd dist
jar cfm ../NumberGuessingGame.jar ../MANIFEST.MF *.class
cd ..

echo Build complete! JAR file created: NumberGuessingGame.jar
echo To run the game: java -jar NumberGuessingGame.jar
pause
