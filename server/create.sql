CREATE TABLE USERS
(
  ID       		                           BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  FIRST_NAME                  VARCHAR(255)        NOT NULL,
  LAST_NAME                    VARCHAR(255)        ,
  DOB                                  DATETIME                      NOT NULL,
  EMAIL       	                     VARCHAR(511)                 NOT NULL,
  PARENT_NAME 	             VARCHAR(511)                 DEFAULT NULL,
  PARENT_CONTACT_NO  VARCHAR(255)                 DEFAULT NULL,
  PASSWORD    	                  VARCHAR(255)                 NOT NULL,
  CREATED_DATE 	              DATETIME                        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (ID)
);