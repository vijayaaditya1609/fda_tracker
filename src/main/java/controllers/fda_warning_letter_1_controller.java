package controllers;

import java.io.IOException;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;

import services.fda_tracket_service;
import tabels.fda_warning_letter_1;

@WebServlet(urlPatterns = "/api/fda_warning_letter_1")
public class fda_warning_letter_1_controller extends HttpServlet {

	private static final long serialVersionUID = 1L;

	public void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		List<fda_warning_letter_1> lst = fda_tracket_service.get_yearwise_warnings();
		resp.getWriter().append(new Gson().toJson(lst));
	}
}
