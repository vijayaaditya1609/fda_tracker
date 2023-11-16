package dao;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class FDATrackerDAO {
	static String loginUser = "postgres";
	static String loginPassword = "PRZQw7uwI1111dS7by7Hyp7hYxJr6jI2B4RfP";
	static String loginUrl = "jdbc:postgresql://13.200.27.188:5432/fda_tracker";  
    public static Connection getConnection(){
        Connection con=null;        
        try {
            Class.forName("org.postgresql.Driver"); 
            con = DriverManager.getConnection(loginUrl, loginUser, loginPassword);
        } catch (SQLException e) {
            System.out.println("Message.. " + e.getMessage());
            e.printStackTrace();            
        } catch (ClassNotFoundException e) {
            System.out.println("Message.. " + e.getMessage());
            e.printStackTrace();
        }        
        return con;
    }

}
