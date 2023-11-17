package controllers;

import java.io.IOException;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;

import services.FDAWarningTrackerService;

@WebServlet(urlPatterns = "/api/fda_warning_letter_country")
public class FdaWarningLettersByCountry extends HttpServlet {
	private static final long serialVersionUID = 1L;

	public void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		String issuingOffice = req.getParameter("issuing_office");
		String subject = req.getParameter("subject");
		List<Map<String, Object>> lst = new FDAWarningTrackerService().getCountryWiseWarnings(issuingOffice, subject);
		resp.getWriter().append(new Gson().toJson(lst));
	}

}
