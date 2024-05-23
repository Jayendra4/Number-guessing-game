package Guess_the_num;

import javax.swing.*;
import java.awt.*;

public class HelpWindow {
    JFrame frame = new JFrame();
    HelpWindow(){
        String s = "Thank you for playing Guess the Number game.\n\nHere are the instructions for playing the game\n\nYou have to guess the randomly generated number by computer \nin limited number of attempts, each time you guess game will tell \nyou if your guess is higher or lower than target number\n\n1.Play game by pressing start button\n2.There are two difficulty settings :-\n\n Easy : Number of attempts are 10\n Hard : Number of attempts are 7";
        JTextArea text = new JTextArea(s);
        text.setForeground(Color.green);
        text.setBackground(Color.BLACK);
        text.setFont(new Font("Monospaced",Font.PLAIN,15));
        text.setEditable(false);

        frame.setSize(600,400);
        frame.setResizable(false);
        frame.setDefaultCloseOperation(WindowConstants.EXIT_ON_CLOSE);
        frame.add(text);
        frame.setVisible(true);

    }
}
