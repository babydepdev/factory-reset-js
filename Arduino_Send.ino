#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>

#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64
#define OLED_RESET -1
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);

int Button = 13;
bool buttonPressed = false;

void setup() {
  Serial.begin(9600);
  pinMode(Button, INPUT);

  if (!display.begin(SSD1306_SWITCHCAPVCC, 0x3C)) {
    Serial.println("SSD1306 allocation failed");
    for (;;)
      ;
  }

  display.clearDisplay();
  display.setTextSize(1);
  display.setTextColor(WHITE);
  display.setCursor(0, 10);
  display.println("Beariot Reset Factory");
  display.display();
}

void loop() {
  int buttonState = digitalRead(Button);

  if (buttonState == HIGH && !buttonPressed) {
    buttonPressed = true;
    Serial.println("1");
    displayOnPressed();
  } else if (buttonState == LOW && buttonPressed) {
    buttonPressed = false;
    displayOnWait();
  }
}

void displayOnPressed() {
  display.clearDisplay();
  display.setCursor(0, 10);
  display.println("Beariot Reset Factory.");
  display.setCursor(0, 30);
  display.println("Please Wait ...");
  display.setCursor(0, 40);
  display.println("Please Don't Close.");
  display.display();
}

void displayOnWait() {
  display.clearDisplay();
  display.setCursor(0, 10);
  display.println("Beariot Reset Factory.");
  display.setCursor(0, 30);
  display.println("Please Push Button for Reset.");
  display.display();
}