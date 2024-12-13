
   import connection from '../config/connectDB.js'; // Ensure you have a database connection setup
  

     // Function to update the popup setting
     export const updatePopupSetting = async (req, res) => {
         const { showPopup } = req.body;
         try {
             if (typeof showPopup !== 'boolean') {
                 return res.status(400).json({ error: 'Invalid input' });
             }
             await connection.query('UPDATE settings SET show_popup = ? WHERE id = 1', [showPopup]);
             res.json({ success: true });
         } catch (error) {
             console.error('Error updating popup setting:', error);
             res.status(500).json({ error: 'Internal Server Error' });
         }
     };
  
     // Function to get the current popup setting
     export const getPopupSetting = async (req, res) => {
         try {
             const [rows] = await connection.query('SELECT show_popup FROM settings WHERE id = 1');
             if (rows.length === 0) {
                 return res.status(404).json({ error: 'Setting not found' });
             }
             res.json({ showPopup: rows[0].show_popup });
         } catch (error) {
             console.error('Error fetching popup setting:', error);
             res.status(500).json({ error: 'Internal Server Error' });
         }
     };