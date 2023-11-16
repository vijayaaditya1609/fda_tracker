package services;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import dao.fda_tracker_dao;
import tabels.fda_warning_letter_1;

public class fda_tracket_service {
	public static List<fda_warning_letter_1> get_yearwise_warnings() {
		List<fda_warning_letter_1> list = new ArrayList<fda_warning_letter_1>();

		try {
			Connection con = fda_tracker_dao.getConnection();
			PreparedStatement ps = con
					.prepareStatement("select count(*) as count, EXTRACT(year FROM issue_date) AS year\r\n"
							+ "from fda_warning_letter_1 fwl \r\n" + "group by EXTRACT(year FROM issue_date)\r\n"
							+ "order by EXTRACT(year FROM issue_date);");
			ResultSet rs = ps.executeQuery();
			while (rs.next()) {
				fda_warning_letter_1 e = new fda_warning_letter_1();
				e.setYear(rs.getInt(2));
				e.setCount(rs.getInt(1));
				list.add(e);
			}
			con.close();
		} catch (Exception e) {
			e.printStackTrace();
		}

		return list;
	}

	public static List<Map<String, Object>> getCompanyWiseWarnings() {
		List<Map<String, Object>> list = new ArrayList<Map<String, Object>>();
		try {
			Connection con = fda_tracker_dao.getConnection();
			PreparedStatement ps = con.prepareStatement("select\r\n" + "	company_name ,\r\n" + "	count(*)\r\n"
					+ "from\r\n" + "	fda_warning_letter_1 fwl\r\n" + "group by\r\n" + "	company_name\r\n"
					+ "having\r\n" + "	count(*) > 1\r\n" + "order by\r\n" + "	count(*) desc\r\n" + "limit 10");
			ResultSet rs = ps.executeQuery();
			while (rs.next()) {
				Map<String, Object> e = new HashMap<String, Object>();
				e.put("company_name", rs.getString("company_name"));
				e.put("count", rs.getInt("count"));
				list.add(e);
			}
			con.close();
		} catch (Exception e) {
			e.printStackTrace();
		}

		return list;
	}

}
