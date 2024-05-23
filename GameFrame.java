package Guess_the_num;

import javax.swing.*;

public class GameFrame extends JFrame{
    GameFrame(){

        this.setSize(500,600);
        this.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        this.setResizable(false);
        this.add(new GamePanel());
        this.setVisible(true);


    }
}
