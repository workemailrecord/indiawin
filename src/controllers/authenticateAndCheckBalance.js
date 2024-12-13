import connection from '../config/connectDB.js';


// ... existing code ...

const authenticateAndCheckBalance = async (req, res, next) => {
  try {
    const auth = req.cookies.auth; // Assuming authentication token is stored in cookies

    if (!auth) {
      return res.status(401).json({ success: false, message: "User not authenticated." });
    }

    const [rows] = await connection.query("SELECT * FROM users WHERE `token` = ?", [auth]);

    if (!rows || rows.length === 0) {
      return res.status(401).json({ success: false, message: "User not authenticated." });
    }
    next(); 
    const user = rows[0];

      // Return only the user's money in the response
    return res.json({ money: user.money });
  } catch (error) {
    console.error("Error in authentication middleware:", error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
  
};

// ... existing code ...

export default authenticateAndCheckBalance;















