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
			String sql = "select company_name as company_name,\n" + "count(*) as count\n"
					+ "from fda_warning_letter_1 fwl\n" + "where\n" + "	1 = 1\n" + filter + "	\n"
					+ "group by company_name\n" + "order by count(*)  desc\n" + "limit 10;";
			PreparedStatement ps = con.prepareStatement(sql);
			//System.out.println("company sql: "+ sql);
			int parameterIndex = 1;
			if (subject != null && subject.length() > 0) {
				ps.setString(parameterIndex++, subject);
			}
			if (issuingOffice != null && issuingOffice.length() > 0) {
				ps.setString(parameterIndex, issuingOffice);
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
			int parameterIndex = 1;
			if (subject != null && subject.length() > 0) {
				ps.setString(parameterIndex++, subject);
			}
			if (issuingOffice != null && issuingOffice.length() > 0) {
				ps.setString(parameterIndex, issuingOffice);
			}
			System.out.println("year sql: "+ sql);
			System.out.println("parameterIndex: "+parameterIndex);
			System.out.println("issuingOffice: "+issuingOffice);
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
	public List<Map<String, Object>> getWarningLetterCompanies() {
		List<Map<String, Object>> list = new ArrayList<Map<String, Object>>();

		try {
			Connection con = FDATrackerDAO.getConnection();
			String sql = "select\n" + "	company_name,\n" + "	count(*)\n" + "from\n" + "	fda_warning_letter_1 fwl\n"
					+ "group by\n" + "	company_name\n" + "order by\n" + "	count(*) desc";
			PreparedStatement ps = con.prepareStatement(sql);
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
	public List<Map<String, Object>> getWarningLetterCountries() {
		List<Map<String, Object>> list = new ArrayList<Map<String, Object>>();

		try {
			Connection con = FDATrackerDAO.getConnection();
			String sql = "select recipient_country, count(*)\r\n"
					+ "from fda_warning_letter_1 fwl \r\n"
					+ "group by recipient_country \r\n"
					+ "order by count(*) desc";
			PreparedStatement ps = con.prepareStatement(sql);
			ResultSet rs = ps.executeQuery();
			while (rs.next()) {
				Map<String, Object> e = new HashMap<String, Object>();
				e.put("count", rs.getInt("count"));
				e.put("recipient_country", rs.getString("recipient_country"));
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

	public List<Map<String, Object>> getCountryWiseWarnings(String issuingOffice, String subject) {
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
			String sql = "select distinct recipient_country ,count(*) as count \r\n"
					+ "from fda_warning_letter_1 fwl\r\n" + "where 1=1" + filter + "group by recipient_country \r\n"
					+ "order by count(*) desc ;";
			PreparedStatement ps = con.prepareStatement(sql);
			int parameterIndex = 1;
			if (subject != null && subject.length() > 0) {
				ps.setString(parameterIndex++, subject);
			}
			if (issuingOffice != null && issuingOffice.length() > 0) {
				ps.setString(parameterIndex, issuingOffice);
			}
			ResultSet rs = ps.executeQuery();
			while (rs.next()) {
				Map<String, Object> e = new HashMap<String, Object>();
				e.put("Recipient_Country", rs.getString("recipient_country"));
				e.put("count", rs.getInt("count"));
				list.add(e);
			}
			con.close();
		} catch (Exception e) {
			e.printStackTrace();
		}

		return list;

	}

	public List<Map<String, Object>> getWarningLetters(String subject, String issuingOffice, String companyName, String recipientCountry) {
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
			if (companyName != null && companyName.length() > 0) {
				filter += " and	company_name = ? ";
			}
			if (recipientCountry != null && recipientCountry.length() > 0) {
				filter += " and	recipient_country = ? ";
			}
			String sql = "select * \r\n"
					+ "from fda_warning_letter_1 fwl\r\n" + "where 1=1" + filter + ";";
			PreparedStatement ps = con.prepareStatement(sql);
			int parameterIndex = 1;
			if (subject != null && subject.length() > 0) {
				ps.setString(parameterIndex++, subject);
			}
			if (issuingOffice != null && issuingOffice.length() > 0) {
				ps.setString(parameterIndex++, issuingOffice);
			}
			if (companyName != null && companyName.length() > 0) {
				ps.setString(parameterIndex++, companyName);
			}
			if (recipientCountry != null && recipientCountry.length() > 0) {
				ps.setString(parameterIndex, recipientCountry);
			}
			System.out.println(ps);
			ResultSet rs = ps.executeQuery();
			while (rs.next()) {
				Map<String, Object> e = new HashMap<String, Object>();
				e.put("id", rs.getInt("id"));
				e.put("posted_date", rs.getDate("posted_date"));
				e.put("issue_date", rs.getDate("issue_date"));
				e.put("company_name", rs.getString("company_name"));
				e.put("letter_url", rs.getString("letter_url"));
				e.put("issuing_office", rs.getString("issuing_office"));
				e.put("subject", rs.getString("subject"));
				e.put("recipient_country", rs.getString("recipient_country"));
				list.add(e);
			}
			con.close();
		} catch (Exception e) {
			e.printStackTrace();
		}

		return list;
	}

}
