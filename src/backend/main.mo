import List "mo:core/List";
import Principal "mo:core/Principal";
import Order "mo:core/Order";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Iter "mo:core/Iter";
import Array "mo:core/Array";

actor {
  module ProjectRequest {
    public type ServiceType = {
      #webDevelopment;
      #consulting;
      #branding;
      #graphicDesign;
      #other;
    };

    public type BusinessType = {
      #startup;
      #smallBusiness;
      #enterprise;
      #nonProfit;
      #individual;
    };

    public type DesignStyle = {
      #modern;
      #minimalist;
      #classic;
      #playful;
      #professional;
    };

    public type BudgetRange = {
      #low;
      #medium;
      #high;
    };

    public type ServiceDetail = {
      #name : Text;
      #enum : Text;
    };

    public type Project = {
      id : Text;
      owner : Principal;
      name : Text;
      email : Text;
      businessName : Text;
      country : Text;
      serviceType : ServiceType;
      serviceDetails : [ServiceDetail];
      businessType : BusinessType;
      featuresRequired : [Text];
      designStyle : DesignStyle;
      budgetRange : BudgetRange;
      timestamp : Time.Time;
    };

    public type ProjectRequest = {
      id : Text;
      owner : Principal;
      name : Text;
      email : Text;
      businessName : Text;
      country : Text;
      serviceType : ServiceType;
      serviceDetails : [ServiceDetail];
      businessType : BusinessType;
      featuresRequired : [Text];
      designStyle : DesignStyle;
      budgetRange : BudgetRange;
      timestamp : Time.Time;
    };

    public func fromProjectRequest(projectRequest : ProjectRequest) : Project {
      {
        id = projectRequest.id;
        owner = projectRequest.owner;
        name = projectRequest.name;
        email = projectRequest.email;
        businessName = projectRequest.businessName;
        country = projectRequest.country;
        serviceType = projectRequest.serviceType;
        serviceDetails = projectRequest.serviceDetails;
        businessType = projectRequest.businessType;
        featuresRequired = projectRequest.featuresRequired;
        designStyle = projectRequest.designStyle;
        budgetRange = projectRequest.budgetRange;
        timestamp = projectRequest.timestamp;
      };
    };

    public func fromProject(project : Project) : ProjectRequest {
      {
        id = project.id;
        owner = project.owner;
        name = project.name;
        email = project.email;
        businessName = project.businessName;
        country = project.country;
        serviceType = project.serviceType;
        serviceDetails = project.serviceDetails;
        businessType = project.businessType;
        featuresRequired = project.featuresRequired;
        designStyle = project.designStyle;
        budgetRange = project.budgetRange;
        timestamp = project.timestamp;
      };
    };

    public func compare(p1 : Project, p2 : Project) : Order.Order {
      switch (p1.timestamp < p2.timestamp, p1.timestamp == p2.timestamp) {
        case (true, _) { #less };
        case (_, true) { #equal };
        case (_, _) { #greater };
      };
    };
  };

  let projects = List.empty<ProjectRequest.Project>();

  module ContactMessage {
    public type Contact = {
      id : Text;
      owner : Principal;
      name : Text;
      email : Text;
      message : Text;
      timestamp : Time.Time;
    };

    public type ContactMessage = {
      id : Text;
      owner : Principal;
      name : Text;
      email : Text;
      message : Text;
      timestamp : Time.Time;
    };

    public func fromContactMessage(contactMessage : ContactMessage) : Contact {
      {
        id = contactMessage.id;
        owner = contactMessage.owner;
        name = contactMessage.name;
        email = contactMessage.email;
        message = contactMessage.message;
        timestamp = contactMessage.timestamp;
      };
    };

    public func fromContact(contact : Contact) : ContactMessage {
      {
        id = contact.id;
        owner = contact.owner;
        name = contact.name;
        email = contact.email;
        message = contact.message;
        timestamp = contact.timestamp;
      };
    };

    public func compare(c1 : Contact, c2 : Contact) : Order.Order {
      switch (c1.timestamp < c2.timestamp, c1.timestamp == c2.timestamp) {
        case (true, _) { #less };
        case (_, true) { #equal };
        case (_, _) { #greater };
      };
    };
  };

  let contacts = List.empty<ContactMessage.Contact>();

  // Project Requests
  public shared ({ caller }) func submitProjectRequest(request : ProjectRequest.ProjectRequest) : async () {
    let project = ProjectRequest.fromProjectRequest(request);
    projects.add(project);
  };

  public query ({ caller }) func getAllProjectRequests() : async [ProjectRequest.Project] {
    projects.toArray().sort();
  };

  // Contact Messages
  public shared ({ caller }) func submitContactMessage(message : ContactMessage.ContactMessage) : async () {
    let contact = ContactMessage.fromContactMessage(message);
    contacts.add(contact);
  };

  public query ({ caller }) func getAllContactMessages() : async [ContactMessage.Contact] {
    contacts.toArray().sort();
  };
};
