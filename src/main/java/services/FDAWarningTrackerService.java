package services;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import dao.FDATrackerDAO;

public class FDAWarningTrackerService {

	public List<Map<String, Object>> getCompanyWiseWarnings(String subject, String issuingOffice) {
		List<Map<String, Object>> list = new ArrayList<Map<String, Object>>();

		try {
			Connection con = FDATrackerDAO.getConnection();
			String filter = "";
			if (subject != null && subject.length() > 0) {
				filter += " and subject = ? ";
			}
			if (issuingOffice != null && issuingOffice.length() > 0) {
				filter += " and	issuing_office = ? ";
			}
			String sql = "select distinct company_name as company_name,\n" + "count(*) as count\n"
					+ "from fda_warning_letter_1 fwl\n" + "where\n" + "	1 = 1\n" + filter + "	\n"
					+ "group by company_name\n" + "order by count(*)  desc\n" + "limit 10;";
			PreparedStatement ps = con.prepareStatement(sql);
			if (subject != null && subject.length() > 0) {
				ps.setString(1, subject);
			}
			if (issuingOffice != null && issuingOffice.length() > 0) {
				ps.setString(2, issuingOffice);
			}

			ResultSet rs = ps.executeQuery();
			while (rs.next()) {
				Map<String, Object> e = new HashMap<String, Object>();
				e.put("count", rs.getInt("count"));
				e.put("company_name", rs.getString("company_name"));
				list.add(e);
			}
			con.close();
		} catch (Exception e) {
			e.printStackTrace();
		}

		return list;
	}

	public List<Map<String, Object>> getYearwiseWarnings(String issuingOffice, String subject) {

		List<Map<String, Object>> list = new ArrayList<Map<String, Object>>();

		try {
			Connection con = FDATrackerDAO.getConnection();
			String filter = "";
			if (subject != null && subject.length() > 0) {
				filter += " and subject = ? ";
			}
			if (issuingOffice != null && issuingOffice.length() > 0) {
				filter += " and	issuing_office = ? ";
			}
			String sql = "select\n" + "	count(*) as count,\n" + "	extract(year\n" + "from\n"
					+ "	issue_date) as year\n" + "from\n" + "	fda_warning_letter_1 fwl\n" + "where\n" + "	1 = 1\n"
					+ filter + "group by\n" + "	extract(year\n" + "from\n" + "	issue_date)\n" + "order by\n"
					+ "	extract(year\n" + "from\n" + "	issue_date);";
			PreparedStatement ps = con.prepareStatement(sql);
			if (subject != null && subject.length() > 0) {
				ps.setString(1, subject);
			}
			if (issuingOffice != null && issuingOffice.length() > 0) {
				ps.setString(2, issuingOffice);
			}
			ResultSet rs = ps.executeQuery();
			while (rs.next()) {
				Map<String, Object> e = new HashMap<String, Object>();
				e.put("count", rs.getInt("count"));
				e.put("year", rs.getInt("year"));
				list.add(e);
			}
			con.close();
		} catch (Exception e) {
			e.printStackTrace();
		}

		return list;
	}

	public List<Map<String, Object>> getWarningLetterIssuingOffices() {
		List<Map<String, Object>> list = new ArrayList<Map<String, Object>>();

		try {
			Connection con = FDATrackerDAO.getConnection();
			String sql = "select\n" + "	issuing_office,\n" + "	count(*)\n" + "from\n" + "	fda_warning_letter_1 fwl\n"
					+ "group by\n" + "	issuing_office\n" + "order by\n" + "	count(*) desc";
			PreparedStatement ps = con.prepareStatement(sql);
			ResultSet rs = ps.executeQuery();
			while (rs.next()) {
				Map<String, Object> e = new HashMap<String, Object>();
				e.put("count", rs.getInt("count"));
				e.put("issuing_office", rs.getString("issuing_office"));
				list.add(e);
			}
			con.close();
		} catch (Exception e) {
			e.printStackTrace();
		}

		return list;
	}

	public List<Map<String, Object>> getWarningLetterSubjects() {
		List<Map<String, Object>> list = new ArrayList<Map<String, Object>>();

		try {
			Connection con = FDATrackerDAO.getConnection();
			String sql = "select\n" + "	subject ,\n" + "	count(*)\n" + "from\n" + "	fda_warning_letter_1 fwl\n"
					+ "group by\n" + "	subject\n" + "order by\n" + "	count(*) desc";
			PreparedStatement ps = con.prepareStatement(sql);
			ResultSet rs = ps.executeQuery();
			while (rs.next()) {
				Map<String, Object> e = new HashMap<String, Object>();
				e.put("count", rs.getInt("count"));
				e.put("subject", rs.getString("subject"));
				list.add(e);
			}
			con.close();
		} catch (Exception e) {
			e.printStackTrace();
		}

		return list;
	}

}
