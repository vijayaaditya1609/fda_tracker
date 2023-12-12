package services;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import dao.FDATrackerDAO;

public class FDADataDashboardService {
	public List<Map<String, Object>> getInspectionsClassifications() {
		List<Map<String, Object>> list = new ArrayList<Map<String, Object>>();
		try {
			Connection con = FDATrackerDAO.getConnection();
			String sql = "select * from fda_inspections_classifications";
			PreparedStatement ps = con.prepareStatement(sql);
			//System.out.println("company sql: "+ sql);
			ResultSet rs = ps.executeQuery();
			while (rs.next()) {
				Map<String, Object> e = new HashMap<String, Object>();
				e.put("id", rs.getInt("id"));
				e.put("feinumber", rs.getString("feinumber"));
				e.put("legalname", rs.getString("legalname"));
				e.put("city", rs.getString("city"));
				e.put("countryname", rs.getString("countryname"));
				e.put("inspectionid", rs.getString("inspectionid"));
				e.put("inspectionenddate", rs.getDate("inspectionenddate"));
				e.put("fiscalyear", rs.getString("fiscalyear"));
				e.put("postedcitations", rs.getString("postedcitations"));
				e.put("classificationcode", rs.getString("classificationcode"));
				e.put("projectarea", rs.getString("projectarea"));
				e.put("producttype", rs.getString("producttype"));
				e.put("additionaldetails", rs.getString("additionaldetails"));
				e.put("firmprofile", rs.getString("firmprofile"));
				list.add(e);
			}
			con.close();
		} catch (Exception e) {
			e.printStackTrace();
		}

		return list;
	}
}
